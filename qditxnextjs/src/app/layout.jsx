'use client'
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
	const pathname = usePathname();

	let sidebarComp = null;
	let display = null
	
	if (pathname === "/") {
		sidebarComp = null;
		display = "block";
	}
	else
	{
		sidebarComp=<Sidebar />;
		display="flex";
	}


	return (
		<html lang="en">
			
			<body>
				
			<div style={{display: display}}>
				<div  className="layoutBase"  style={{display: sidebarComp ? 'flex' : 'none' }}>
					{sidebarComp}
				</div> 

				<div className="ChildrenContainer" style={{marginLeft: "5px"}}> 
				{children}
				</div>
			</div> 

			
				
			</body>
		</html>
	);
}
