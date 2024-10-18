import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Notification from "../chats/Notification";

const NavBar = () => {
    const [user, , , , , , logoutUser] = useContext(AuthContext); // Ensure you access logoutUser correctly
    return (
        <Navbar bg="dark" className="mb-4" style={{ height: "3.75rem" }}>
            <Container>
                
                <h2>
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-chat-left-dots-fill" viewBox="0 0 16 16">
  <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793zm5 4a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
</svg>
                    <Link to="/" className="link-light text-decoration-none ms-2 ">Quick Chat App</Link>
                </h2>
                {user && (<span className="text-warning">Hey {user?.name} !</span>)}
                <Nav>
                    <Stack direction="horizontal" gap={3}>
                        {user && (
                            <>
                                <Notification />
                                <Link onClick={() => logoutUser()} to="/login" className="link-light text-decoration-none">Logout</Link>
                            </>
                        )}
                        {!user && (<>
                            <Link to="/login" className="link-light text-decoration-none">Login</Link>
                            <Link to="/register" className="link-light text-decoration-none">Register</Link>
                        </>
                        )
                        }
                    </Stack>
                </Nav>
            </Container>
        </Navbar>
    );
}

export default NavBar;