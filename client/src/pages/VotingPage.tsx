/* VotingPage — GovLens Public Voting System
 * Vote on government initiatives, visualize public sentiment
 * Glassmorphic Civic Premium design
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { Vote, Users, BarChart3, CheckCircle, MapPin, Calendar } from "lucide-react";
import { votes } from "@/lib/mockData";
import { toast } from "sonner";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function VotingPage() {
  const [userVotes, setUserVotes] = useState<Record<string, number>>({});

  const handleVote = (voteId: string, optionIndex: number) => {
    if (userVotes[voteId] !== undefined) {
      toast.info("You have already voted on this initiative.");
      return;
    }
    setUserVotes((prev) => ({ ...prev, [voteId]: optionIndex }));
    toast.success("Vote recorded! Thank you for participating.");
  };

  const totalVotesAll = votes.reduce((a, v) => a + v.totalVotes, 0);
  const activeVotes = votes.filter((v) => v.status === "active").length;

  return (
    <div className="p-6 space-y-6" style={{ background: "#060B18", minHeight: "100%" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-extrabold text-white" style={{ fontFamily: "Syne, sans-serif" }}>
          Public Voting
        </h1>
        <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
          Vote on government initiatives and community proposals
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-3 gap-3"
      >
        {[
          { label: "Active Polls", value: activeVotes, icon: Vote, color: "#0EA5E9" },
          { label: "Total Votes Cast", value: totalVotesAll.toLocaleString(), icon: Users, color: "#6366F1" },
          { label: "Categories", value: new Set(votes.map((v) => v.category)).size, icon: BarChart3, color: "#22C55E" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.07 }}
            className="stat-card"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: `${s.color}18` }}>
              <s.icon size={16} style={{ color: s.color }} />
            </div>
            <div className="text-xl font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>{s.value}</div>
            <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{s.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Vote cards */}
      <div className="space-y-6">
        {votes.map((vote, i) => {
          const userVoteIdx = userVotes[vote.id];
          const hasVoted = userVoteIdx !== undefined;
          const maxVotes = Math.max(...vote.options.map((o) => o.votes));

          return (
            <motion.div
              key={vote.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-6"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-2 flex-wrap">
                <h3 className="text-base font-bold text-white flex-1" style={{ fontFamily: "Syne, sans-serif" }}>
                  {vote.title}
                </h3>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0"
                  style={{
                    background: vote.status === "active" ? "rgba(14,165,233,0.15)" : "rgba(255,255,255,0.08)",
                    color: vote.status === "active" ? "#0EA5E9" : "rgba(255,255,255,0.4)",
                    border: `1px solid ${vote.status === "active" ? "rgba(14,165,233,0.3)" : "rgba(255,255,255,0.1)"}`,
                  }}
                >
                  {vote.status === "active" ? "Active" : "Closed"}
                </span>
              </div>

              <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>{vote.description}</p>

              <div className="flex items-center gap-4 mb-5 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                  <MapPin size={11} /> {vote.state}
                </div>
                <div className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                  <Users size={11} /> {vote.totalVotes.toLocaleString()} votes
                </div>
                <div className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                  <Calendar size={11} /> Ends {vote.endDate}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Voting options */}
                <div className="space-y-3">
                  {vote.options.map((option, idx) => {
                    const pct = Math.round((option.votes / vote.totalVotes) * 100);
                    const isSelected = userVoteIdx === idx;
                    const isWinner = option.votes === maxVotes;

                    return (
                      <motion.button
                        key={option.label}
                        whileHover={!hasVoted ? { scale: 1.01 } : {}}
                        whileTap={!hasVoted ? { scale: 0.99 } : {}}
                        onClick={() => !hasVoted && vote.status === "active" && handleVote(vote.id, idx)}
                        className="w-full rounded-xl p-3 text-left transition-all duration-200"
                        style={{
                          background: isSelected
                            ? `${option.color}18`
                            : "rgba(255,255,255,0.04)",
                          border: `1px solid ${isSelected ? `${option.color}44` : "rgba(255,255,255,0.07)"}`,
                          cursor: hasVoted || vote.status !== "active" ? "default" : "pointer",
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {isSelected && <CheckCircle size={14} style={{ color: option.color }} />}
                            <span className="text-sm font-semibold text-white">{option.label}</span>
                            {hasVoted && isWinner && (
                              <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: `${option.color}22`, color: option.color }}>
                                Leading
                              </span>
                            )}
                          </div>
                          {hasVoted && (
                            <span className="text-sm font-bold" style={{ color: option.color }}>{pct}%</span>
                          )}
                        </div>
                        {hasVoted && (
                          <div className="progress-bar">
                            <motion.div
                              className="h-full rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.8 }}
                              style={{ background: `linear-gradient(90deg, ${option.color}, ${option.color}88)` }}
                            />
                          </div>
                        )}
                        {!hasVoted && (
                          <div className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                            {option.votes.toLocaleString()} votes
                          </div>
                        )}
                      </motion.button>
                    );
                  })}

                  {!hasVoted && vote.status === "active" && (
                    <p className="text-xs text-center mt-2" style={{ color: "rgba(255,255,255,0.3)" }}>
                      Click an option to cast your vote
                    </p>
                  )}
                </div>

                {/* Pie chart (shown after voting or always) */}
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <ResponsiveContainer width={160} height={160}>
                      <PieChart>
                        <Pie
                          data={vote.options}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          paddingAngle={3}
                          dataKey="votes"
                        >
                          {vote.options.map((opt, idx) => (
                            <Cell
                              key={idx}
                              fill={opt.color}
                              opacity={!hasVoted ? 0.4 : 1}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const d = payload[0].payload;
                              const pct = Math.round((d.votes / vote.totalVotes) * 100);
                              return (
                                <div
                                  className="rounded-xl px-3 py-2"
                                  style={{
                                    background: "rgba(10,16,35,0.95)",
                                    border: "1px solid rgba(14,165,233,0.2)",
                                    backdropFilter: "blur(16px)",
                                    fontSize: 12,
                                  }}
                                >
                                  <p className="font-semibold text-white">{d.label}</p>
                                  <p style={{ color: d.color }}>{pct}% ({d.votes.toLocaleString()})</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
                      {hasVoted ? "Results" : "Distribution"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
