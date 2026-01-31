import { HiOutlineChatBubbleLeftRight, HiOutlineUserGroup, HiOutlineMagnifyingGlass } from "react-icons/hi2";

export default function Main() {
  return (  
    <main className="flex-1 flex flex-col items-center justify-center p-8 bg-primary">
      <div className="text-center max-w-md animate-fade-in">
        {/* Icon */}
        <div className="w-24 h-24 mx-auto mb-6 rounded-3xl gradient-primary flex items-center justify-center">
          <HiOutlineChatBubbleLeftRight className="w-12 h-12 text-white" />
        </div>
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-primary mb-3">
          Welcome to LinkUp
        </h2>
        
        {/* Description */}
        <p className="text-secondary mb-8">
          Select a conversation from the sidebar to start chatting, or explore new connections.
        </p>
        
        {/* Tips */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary border border-theme text-left">
            <div className="w-10 h-10 rounded-xl bg-[rgb(var(--primary)/0.1)] flex items-center justify-center flex-shrink-0">
              <HiOutlineMagnifyingGlass className="w-5 h-5 text-[rgb(var(--primary))]" />
            </div>
            <div>
              <h3 className="font-medium text-primary text-sm">Explore</h3>
              <p className="text-xs text-tertiary">Search for users to start a conversation</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary border border-theme text-left">
            <div className="w-10 h-10 rounded-xl bg-[rgb(var(--primary)/0.1)] flex items-center justify-center flex-shrink-0">
              <HiOutlineUserGroup className="w-5 h-5 text-[rgb(var(--primary))]" />
            </div>
            <div>
              <h3 className="font-medium text-primary text-sm">Create Groups</h3>
              <p className="text-xs text-tertiary">Collaborate with multiple people at once</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}