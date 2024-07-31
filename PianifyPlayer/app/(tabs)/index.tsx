import { View, Text } from "react-native";
import type { StatusBarStyle } from 'react-native';

import SignUp from "@/views/auth/SignUp";
import SignIn from "@/views/auth/SignIn";
import LostPassword from "@/views/auth/LostPassword";
import Verification from "@/views/auth/Verification";

const App = () => {
  return (
    <SignIn />
    // <SignUp />
    // <LostPassword />
    // <Verification />
  )
}

export default App