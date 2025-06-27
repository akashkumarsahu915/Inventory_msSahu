import { Link } from 'react-router-dom'
import styles from './NotFound.module.css'

const NotFound = () => {
  return (
    <div className={styles.notFound}>
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn btn-primary">
        Return to Dashboard
      </Link>
    </div>
  )
}

export default NotFound