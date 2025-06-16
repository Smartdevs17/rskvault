import { NavigationContainer } from "@react-navigation/native";
import AppRoutes from "./src/routes/AppRoutes";

function App() {
  return (
    <NavigationContainer>
      <AppRoutes />
    </NavigationContainer>
  );
}

export default App;
