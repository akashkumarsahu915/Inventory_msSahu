import { Link, useLocation } from 'react-router-dom'
import { 
  FaTachometerAlt, 
  FaBoxes, 
  FaShoppingCart, 
  FaChartBar, 
  FaPlus, 
  FaTimes,
  FaCog,
  FaSignOutAlt
} from 'react-icons/fa'
import styles from './Sidebar.module.css'

const Sidebar = ({ isOpen, closeSidebar }) => {
  const location = useLocation()
  
  const isActive = (path) => {
    return location.pathname === path
  }
  
  const menuItems = [
    { path: '/', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { path: '/inventory', label: 'Inventory', icon: <FaBoxes /> },
    { path: '/sales', label: 'Sales', icon: <FaShoppingCart /> },
    { path: '/reports', label: 'Reports', icon: <FaChartBar /> }
  ]
  
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div className={styles.overlay} onClick={closeSidebar}></div>
      )}
      
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.sidebarHeader}>
          <h2>MS Sahu <br></br><span>Seeds & Fertilizer</span></h2>
          <button className={styles.closeButton} onClick={closeSidebar}>
            <FaTimes />
          </button>
        </div>
        
        <div className={styles.quickActions}>
          <Link to="/sales/new" className={styles.newSaleButton}>
            <FaPlus />
            <span>New Sale</span>
          </Link>
        </div>
        
        <nav className={styles.navigation}>
          <ul>
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={`${styles.navLink} ${isActive(item.path) ? styles.active : ''}`}
                  onClick={closeSidebar}
                >
                  <span className={styles.icon}>{item.icon}</span>
                  <span className={styles.label}>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className={styles.sidebarFooter}>
          <Link to="/settings" className={styles.footerLink}>
            <FaCog />
            <span>Settings</span>
          </Link>
          <button className={styles.footerLink}>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar