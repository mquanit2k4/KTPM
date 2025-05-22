import { motion } from "framer-motion";

const AnimatedFrame = ({children}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 1 }}
        >
            {children}
        </motion.div>
    )
}

export default AnimatedFrame;