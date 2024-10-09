import { useContext } from "react";
import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";


const Login = () => {
    const[
        user, , , , , , , 
        loginUser, 
        loginError, 
        loginInfo, 
        updateLoginInfo, 
        isLoginLoading
    ] = useContext(AuthContext);
    return (
        <>
            <Form onSubmit={loginUser}>
                <Row style={{
                    height: "100vh",
                    justifyContent: "center",
                    padding: "10%",

                }}>
                    <Col xs={6}>
                        <Stack gap={3}>
                            <h2 className="text-center" style={{ marginBottom: '0' }}>Login</h2>
                            <hr className="mt-0" />
                            <Form.Control type="email" placeholder="Email" onChange={(e)=> updateLoginInfo({...loginInfo, email:e.target.value})} />
                            <Form.Control type="password" placeholder="Password" onChange={(e)=> updateLoginInfo({...loginInfo, password:e.target.value})}/>
                            <Button variant="primary" type="submit">
                                {isLoginLoading ? "Getting you in..." : "Login"}
                            </Button>
                             {
                            loginError?.error && <Alert variant="danger">
                                <p>{loginError?.message}</p>
                            </Alert>
                        }
                        </Stack>
                    </Col>
                </Row>
            </Form>
        </>
    );
}

export default Login;