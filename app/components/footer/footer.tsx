type FooterProps = {
  className?: string
}

export default function Footer({ className = "" }: FooterProps) {
  return (
    <footer className={`site-footer ${className}`}>

      <div className="site-footer__inner">
        <p className="site-footer__title">
          © 2026 Todos los derechos reservados
        </p>
      </div>
    </footer>
  )
}