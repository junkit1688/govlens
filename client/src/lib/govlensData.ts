import type { CitizenReport, ForumPost, Petition } from "@/lib/mockData";
import { requireSupabase, supabase } from "@/lib/supabaseClient";

type CreateReportInput = {
  userId: string;
  authorName: string;
  title: string;
  description: string;
  category: CitizenReport["category"];
  state: string;
  locationText: string;
  imageUrl?: string;
};

type CreatePetitionInput = {
  userId: string;
  authorName: string;
  title: string;
  description: string;
  state: string;
  category: string;
  target: number;
  tags: string[];
};

type CreateForumPostInput = {
  userId: string;
  authorName: string;
  title: string;
  content: string;
  state: string;
  category: string;
  tags: string[];
};

type CastVoteInput = {
  userId: string;
  policyId: string;
  policyTitle: string;
  optionIndex: number;
  optionLabel: string;
};

export type GovLensNotification = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  readAt: string | null;
};

export async function fetchReports(): Promise<CitizenReport[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("demo_reports")
    .select("id,user_id,title,description,category,state,location_text,status,image_url,author_name,created_at")
    .order("created_at", { ascending: false });

  throwIfSupabaseError(error, "load reports");

  return (data || []).map((row: any) => ({
    id: row.id,
    userId: row.user_id,
    title: row.title,
    description: row.description,
    category: row.category,
    state: row.state,
    location: row.location_text,
    status: mapReportStatus(row.status),
    reportedAt: formatDate(row.created_at),
    reporter: row.author_name || "GovLens user",
    upvotes: 0,
    imageUrl: row.image_url || "",
    imageAlt: row.image_url ? `Report image for ${row.title}` : "Citizen report image",
  }));
}

export async function createReport(input: CreateReportInput): Promise<CitizenReport> {
  const client = requireSupabase();
  const { data, error } = await client
    .from("demo_reports")
    .insert({
      user_id: input.userId,
      author_name: input.authorName,
      title: input.title,
      description: input.description,
      category: input.category,
      state: input.state,
      location_text: input.locationText,
      image_url: input.imageUrl || null,
      status: "submitted",
    })
    .select("id,user_id,title,description,category,state,location_text,status,image_url,author_name,created_at")
    .single();

  throwIfSupabaseError(error, "save report");
  throwIfMissingData(data, "save report");

  return {
    id: data.id,
    userId: data.user_id,
    title: data.title,
    description: data.description,
    category: data.category,
    state: data.state,
    location: data.location_text,
    status: mapReportStatus(data.status),
    reportedAt: formatDate(data.created_at),
    reporter: data.author_name || "GovLens user",
    upvotes: 0,
    imageUrl: data.image_url || "",
    imageAlt: data.image_url ? `Report image for ${data.title}` : "Citizen report image",
  };
}

export async function deleteReport(reportId: string, userId: string) {
  const client = requireSupabase();
  const { data, error } = await client
    .from("demo_reports")
    .delete()
    .eq("id", reportId)
    .eq("user_id", userId)
    .select("id");

  throwIfSupabaseError(error, "delete report");
  throwIfDeleteMissed(data, "delete report");
}

export async function fetchPetitions(): Promise<Petition[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("demo_petitions")
    .select("id,user_id,title,description,state,category,target,signature_count,status,tags,author_name,created_at")
    .order("created_at", { ascending: false });

  throwIfSupabaseError(error, "load petitions");

  return (data || []).map((row: any) => ({
    id: row.id,
    userId: row.user_id,
    title: row.title,
    description: row.description,
    state: row.state,
    category: row.category,
    signatures: row.signature_count || 0,
    target: row.target || 1000,
    status: row.status || "active",
    createdAt: formatDate(row.created_at),
    author: row.author_name || "GovLens user",
    tags: row.tags || [],
  }));
}

export async function createPetition(input: CreatePetitionInput): Promise<Petition> {
  const client = requireSupabase();
  const { data, error } = await client
    .from("demo_petitions")
    .insert({
      user_id: input.userId,
      author_name: input.authorName,
      title: input.title,
      description: input.description,
      state: input.state,
      category: input.category,
      target: input.target,
      signature_count: 0,
      status: "active",
      tags: input.tags,
    })
    .select("id,user_id,title,description,state,category,target,signature_count,status,tags,author_name,created_at")
    .single();

  throwIfSupabaseError(error, "save petition");
  throwIfMissingData(data, "save petition");

  await signPetition(data.id, input.userId);

  return {
    id: data.id,
    userId: data.user_id,
    title: data.title,
    description: data.description,
    state: data.state,
    category: data.category,
    signatures: data.signature_count || 1,
    target: data.target || 1000,
    status: data.status || "active",
    createdAt: formatDate(data.created_at),
    author: data.author_name || "GovLens user",
    tags: data.tags || [],
  };
}

export async function deletePetition(petitionId: string, userId: string) {
  const client = requireSupabase();
  const { data, error } = await client
    .from("demo_petitions")
    .delete()
    .eq("id", petitionId)
    .eq("user_id", userId)
    .select("id");

  throwIfSupabaseError(error, "delete petition");
  throwIfDeleteMissed(data, "delete petition");
}

export async function signPetition(petitionId: string, userId: string) {
  const client = requireSupabase();
  const { error } = await client.from("demo_petition_signatures").insert({
    petition_id: petitionId,
    user_id: userId,
  });

  throwIfSupabaseError(error, "sign petition");
}

export async function fetchForumPosts(): Promise<ForumPost[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("demo_forum_posts")
    .select("id,user_id,title,content,state,category,tags,likes,replies,views,trending,author_name,created_at")
    .order("created_at", { ascending: false });

  throwIfSupabaseError(error, "load forum posts");

  return (data || []).map((row: any) => ({
    id: row.id,
    userId: row.user_id,
    title: row.title,
    content: row.content,
    author: row.author_name || "GovLens user",
    state: row.state,
    category: row.category,
    likes: row.likes || 0,
    replies: row.replies || 0,
    views: row.views || 0,
    createdAt: formatDate(row.created_at),
    tags: row.tags || [],
    trending: Boolean(row.trending),
  }));
}

export async function createForumPost(input: CreateForumPostInput): Promise<ForumPost> {
  const client = requireSupabase();
  const { data, error } = await client
    .from("demo_forum_posts")
    .insert({
      user_id: input.userId,
      author_name: input.authorName,
      title: input.title,
      content: input.content,
      state: input.state,
      category: input.category,
      tags: input.tags,
    })
    .select("id,user_id,title,content,state,category,tags,likes,replies,views,trending,author_name,created_at")
    .single();

  throwIfSupabaseError(error, "save forum post");
  throwIfMissingData(data, "save forum post");

  return {
    id: data.id,
    userId: data.user_id,
    title: data.title,
    content: data.content,
    author: data.author_name || "GovLens user",
    state: data.state,
    category: data.category,
    likes: data.likes || 0,
    replies: data.replies || 0,
    views: data.views || 1,
    createdAt: formatDate(data.created_at),
    tags: data.tags || [],
    trending: Boolean(data.trending),
  };
}

export async function deleteForumPost(postId: string, userId: string) {
  const client = requireSupabase();
  const { data, error } = await client
    .from("demo_forum_posts")
    .delete()
    .eq("id", postId)
    .eq("user_id", userId)
    .select("id");

  throwIfSupabaseError(error, "delete forum post");
  throwIfDeleteMissed(data, "delete forum post");
}

export async function castVote(input: CastVoteInput) {
  const client = requireSupabase();
  const { error } = await client.from("demo_votes").insert({
    user_id: input.userId,
    policy_id: input.policyId,
    policy_title: input.policyTitle,
    option_index: input.optionIndex,
    option_label: input.optionLabel,
  });

  throwIfSupabaseError(error, "save vote");
}

export async function fetchNotifications(userId?: string): Promise<GovLensNotification[]> {
  if (!supabase) return [];

  let query = supabase
    .from("notifications")
    .select("id,title,message,created_at,read_at")
    .order("created_at", { ascending: false })
    .limit(5);

  if (userId) query = query.eq("user_id", userId);

  const { data, error } = await query;
  throwIfSupabaseError(error, "load notifications");

  return (data || []).map((row) => ({
    id: row.id,
    title: row.title,
    message: row.message,
    createdAt: row.created_at,
    readAt: row.read_at,
  }));
}

function mapReportStatus(status: string): CitizenReport["status"] {
  if (status === "resolved") return "resolved";
  if (status === "under_review" || status === "in_progress") return "investigating";
  return "pending";
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-MY", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function throwIfSupabaseError(error: unknown, action: string) {
  if (!error) return;

  if (typeof error === "object" && error !== null && "message" in error) {
    const details = "details" in error && typeof error.details === "string" ? ` ${error.details}` : "";
    const hint = "hint" in error && typeof error.hint === "string" ? ` ${error.hint}` : "";
    throw new Error(`Could not ${action}: ${String(error.message)}${details}${hint}`.trim());
  }

  throw new Error(`Could not ${action}.`);
}

function throwIfMissingData<T>(data: T | null, action: string): asserts data is T {
  if (!data) throw new Error(`Could not ${action}: no data was returned from Supabase.`);
}

function throwIfDeleteMissed(data: { id: string }[] | null, action: string) {
  if (!data?.length) throw new Error(`Could not ${action}: item was not found or is not yours.`);
}

function getProfileName(profile: { name?: string } | { name?: string }[] | null | undefined) {
  const row = Array.isArray(profile) ? profile[0] : profile;
  return row?.name || "GovLens user";
}
