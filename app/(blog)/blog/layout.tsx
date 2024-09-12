import Navbar from "../../(dashboard)/_components/navbar";

const BlogLayout = ({children} : {children: React.ReactNode;}) => {
  return(
    <div>
      <Navbar/>
      <main>{children}</main>
    </div>
  )
}

export default BlogLayout;