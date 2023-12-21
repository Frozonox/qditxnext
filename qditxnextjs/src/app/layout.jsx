import { Inter } from "next/font/google"; // Corrige la importación
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap"; // Asegúrate de importar los componentes de react-bootstrap
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<Navbar expand="lg" className="bg-body-tertiary">
					<Container>
						<Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
						<Navbar.Toggle aria-controls="basic-navbar-nav" />
						<Navbar.Collapse id="basic-navbar-nav">
							<Nav className="me-auto">
								<Nav.Link href="#home">Home</Nav.Link>
								<Nav.Link href="#link">Link</Nav.Link>
								<NavDropdown title="Dropdown" id="basic-nav-dropdown">
									<NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
									<NavDropdown.Item href="#action/3.2">
										Another action
									</NavDropdown.Item>
									<NavDropdown.Item href="#action/3.3">
										Something
									</NavDropdown.Item>
									<NavDropdown.Divider />
									<NavDropdown.Item href="#action/3.4">
										Separated link
									</NavDropdown.Item>
								</NavDropdown>
							</Nav>
						</Navbar.Collapse>
					</Container>
				</Navbar>

				{children}
			</body>
		</html>
	);
}
