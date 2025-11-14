import { Navigate, useLocation } from "react-router-dom";
import { useTokenStore} from "../shared/store/tokenStore.js";

const RouteProtector = ({ children }) => {
    const isAuthenticated = useTokenStore((state) => state.isAuthenticated);
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace/>;
    }

    return children;
}

export default RouteProtector;