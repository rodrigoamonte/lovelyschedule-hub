// import { useAuth } from '@/contexts/AuthContext';
// // import { useNotifications } from '@/presentation/hooks/useNotifications';
// import { Bell, Mail, MailOpen } from 'lucide-react';

// export default function NotificationsPage() {
//   const { user } = useAuth();
//   const { notifications, markAsRead } = useNotifications(user?.id);

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center gap-3">
//         <Bell className="h-6 w-6 text-primary" />
//         <h1 className="text-2xl font-bold">Notificações</h1>
//       </div>

//       <div className="space-y-3">
//         {notifications.map(n => (
//           <div
//             key={n.id}
//             onClick={() => markAsRead(n.id)}
//             className={`p-4 rounded-xl border flex gap-4 cursor-pointer transition-colors ${n.read ? 'bg-background' : 'bg-accent/5 border-primary/20'}`}
//           >
//             {n.read ? <MailOpen className="h-5 w-5 text-muted-foreground" /> : <Mail className="h-5 w-5 text-primary" />}
//             <div>
//               <p className={`text-sm ${!n.read ? 'font-bold' : ''}`}>{n.title}</p>
//               <p className="text-xs text-muted-foreground">{n.message}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
