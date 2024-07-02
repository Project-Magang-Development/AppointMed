import React, { useRef, ReactNode } from "react";
import { useInView } from "framer-motion";

interface SectionProps {
  children: ReactNode;
}

const Section: React.FC<SectionProps> = ({ children }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref}>
      <div
        ref={ref}
        style={{
          transform: isInView ? "none" : "translateY(200px)",
          opacity: isInView ? 1 : 0,
          transition: "all 0.3s cubic-bezier(0.17, 0.55, 0.55, 1) 0.3s",
        }}
      >
        {children}
      </div>
    </section>
  );
};

export default Section;
