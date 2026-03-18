export const formatKES = (amount) => {
  if (amount >= 1_000_000) return `KES ${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `KES ${(amount / 1_000).toFixed(0)}K`;
  return `KES ${amount.toLocaleString()}`;
};

export const formatKESFull = (amount) =>
  `KES ${amount.toLocaleString("en-KE")}`;

export const pct = (raised, target) =>
  Math.min(100, Math.round((raised / target) * 100));

export const initials = (name) =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export const getCategoryColor = (cat) => {
  const map = {
    medical: "tag-green",
    education: "tag-sky",
    emergency: "tag-sun",
    memorial: "tag-earth",
    community: "tag-green",
    wedding: "tag-sun",
    business: "tag-sky",
    church: "tag-earth",
  };
  return map[cat] || "tag-green";
};
