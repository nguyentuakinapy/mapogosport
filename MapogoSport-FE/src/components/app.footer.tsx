'use client'

import { Button, Container, Form } from "react-bootstrap";

const Footer = () => {
    return (
        <>
            <footer className="bg-secondary">
                <Container>
                    <div className="row">
                        <div className="col"><img src="/images/logo.png" style={{ width: '20%' }} alt="" /></div>
                        <div className="col">
                            <Form className="d-flex m-auto mt-3">
                                <Form.Control
                                    type="search"
                                    placeholder="Search"
                                    className="me-2"
                                    aria-label="Search"
                                    style={{ width: '100%' }}
                                />
                                <Button variant="outline-dark"><i className="bi bi-search"></i></Button>
                            </Form>
                        </div>
                    </div>
                </Container>


            </footer>
        </>
    )
}
export default Footer;