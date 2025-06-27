import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { FaBars, FaSearch, FaBell, FaUser } from 'react-icons/fa'
import styles from './Header.module.css'

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/inventory?search=${encodeURIComponent(searchQuery)}`)
    }
  }
  
  return (
    <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}>
      <div className={styles.headerContent}>
        <div className={styles.leftSide}>
          <button className={styles.menuButton} onClick={toggleSidebar}>
            <FaBars />
          </button>
          <div className={styles.logo}>
            <h1>MS Sahu</h1>
            <span>Seeds & Fertilizer</span>
          </div>
        </div>
        
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <div className={styles.searchBar}>
            <FaSearch className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search inventory..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
        
        <div className={styles.rightSide}>
          <button className={styles.iconButton}>
            <FaBell />
            <span className={styles.notificationBadge}>2</span>
          </button>
          <div className={styles.userProfile}>
            <div className={styles.avatar}>
              <FaUser />
            </div>
            <span className={styles.userName}>Admin</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header