import { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import styles from './Layout.module.css'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className={styles.layout}>
      <Header toggleSidebar={toggleSidebar} />
      <div className={styles.container}>
        <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />
        <main className={styles.main}>
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout