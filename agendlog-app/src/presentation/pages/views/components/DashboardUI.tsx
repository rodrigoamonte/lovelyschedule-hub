// import { ROLE_LABELS } from "@/lib/mock-data";
// import { THEME_CONFIG } from "@/shared/styles/theme-constants";
// import React from "react";

// export function DashboardShell({
//   title,
//   subtitle,
//   role,
//   children,
// }: {
//   title: string;
//   subtitle: string;
//   role: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <div className={THEME_CONFIG.layout.shell}>
//       <div>
//         <h1 className={THEME_CONFIG.typography.h1}>{title}</h1>
//         <p className={THEME_CONFIG.typography.subtitle}>
//           {subtitle} • {ROLE_LABELS[role as keyof typeof ROLE_LABELS]}
//         </p>
//       </div>
//       {children}
//     </div>
//   );
// }

// export function StatCard({
//   icon,
//   label,
//   value,
// }: {
//   icon: React.ReactNode;
//   label: string;
//   value: number;
// }) {
//   return (
//     <div className={`${THEME_CONFIG.layout.card} p-4 flex items-center gap-4`}>
//       <div className={`${THEME_CONFIG.icons.container} bg-secondary`}>
//         {icon}
//       </div>
//       <div>
//         <p className={THEME_CONFIG.typography.h1}>{value}</p>
//         <p className={THEME_CONFIG.typography.detail}>{label}</p>
//       </div>
//     </div>
//   );
// }
