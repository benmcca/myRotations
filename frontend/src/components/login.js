import React from "react";

import { motion } from "framer-motion";

function Login() {
  return (
    <motion.div
      className="App"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      Login
    </motion.div>
  );
}

export default Login;
