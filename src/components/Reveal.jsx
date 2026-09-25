import { useEffect, useRef } from "react";

export default function Reveal({ as: Tag = "div", index = 0, className = "", style, children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ "--i": index, ...style }} {...rest}>
      {children}
    </Tag>
  );
}
