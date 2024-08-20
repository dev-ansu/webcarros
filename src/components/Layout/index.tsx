import {Outlet} from "react-router-dom"
import Header from "../Header";
import Container from "../Container";

const Layout = ()=>{
    return(
        <>
            <Header />
            <Container>
                <Outlet />
            </Container>
        </>
    )
}

export default Layout; 