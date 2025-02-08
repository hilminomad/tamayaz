import { LinksBar } from "./_components/links-bar";

const AnalyticsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="h-[80px] flex items-end px-6 pt-6">
        <LinksBar/>
      </div>
      <main className="min-h-screen h-full">{children}</main>
    </div>
  );
};

export default AnalyticsLayout;