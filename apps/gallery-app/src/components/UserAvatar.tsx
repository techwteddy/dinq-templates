interface UserAvatarProps {
  username: string;
  avatarUrl?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function UserAvatar({ username, avatarUrl, size = 'md', className = '' }: UserAvatarProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-16 h-16 text-xl'
  };

  // Generate a consistent color based on username
  const generateGradient = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colors = [
      'from-purple-500 to-pink-500',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-teal-500',
      'from-yellow-500 to-orange-500',
      'from-red-500 to-pink-500',
      'from-indigo-500 to-purple-500',
      'from-cyan-500 to-blue-500',
      'from-teal-500 to-green-500',
      'from-orange-500 to-red-500',
      'from-pink-500 to-purple-500',
    ];
    
    return colors[Math.abs(hash) % colors.length];
  };

  const firstLetter = username.charAt(0).toUpperCase();
  const gradientClass = generateGradient(username);

  // If we have a custom avatar URL, use it
  if (avatarUrl) {
    return (
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden shadow-lg ${className}`}>
        <img
          src={avatarUrl}
          alt={`${username}'s avatar`}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // Otherwise, use the generated gradient avatar
  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        rounded-full 
        bg-gradient-to-br ${gradientClass} 
        flex items-center justify-center 
        text-white font-medium 
        shadow-lg
        ${className}
      `}
    >
      {firstLetter}
    </div>
  );
}
