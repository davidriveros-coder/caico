export default function Badge({ children, className = '' }) {
  return <span className={`badge-clean ${className}`}>{children}</span>
}
