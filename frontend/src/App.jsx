import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Wallet, Send, Trophy, Clock, Coins, AlertCircle, CheckCircle, Loader } from 'lucide-react'
import MessageBoardABI from '../../artifacts/contracts/MessageBoard.sol/MessageBoard.json'
import './App.css'

const CONTRACT_ADDRESS = "0xeAFf0f97675710408B6931f6E1654039fFD7ccd3" // 部署后替换

function App() {
  const [account, setAccount] = useState('')
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [bidAmount, setBidAmount] = useState('0.01')
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState(null)
  const [minBid, setMinBid] = useState('0')
  const [messageCount, setMessageCount] = useState(0)

  useEffect(() => {
    checkWalletConnection()
    loadMessages()
    
    // 创建背景粒子
    createParticles()
  }, [])

  const createParticles = () => {
    const container = document.querySelector('.particles')
    if (!container) return
    
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div')
      particle.className = 'particle'
      particle.style.left = Math.random() * 100 + '%'
      particle.style.top = Math.random() * 100 + '%'
      particle.style.animationDelay = Math.random() * 6 + 's'
      particle.style.animationDuration = (Math.random() * 4 + 4) + 's'
      container.appendChild(particle)
    }
  }

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          setAccount(accounts[0])
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error)
      }
    }
  }

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        setAccount(accounts[0])
        showNotification('钱包连接成功！', 'success')
      } catch (error) {
        console.error('Error connecting wallet:', error)
        showNotification('钱包连接失败', 'error')
      }
    } else {
      showNotification('请安装 MetaMask 钱包', 'error')
    }
  }

  const loadMessages = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(CONTRACT_ADDRESS, MessageBoardABI.abi, provider)
      
      const msgs = await contract.getMessages()
      const count = await contract.getMessageCount()
      const minimum = await contract.getMinimumBidForTop100()
      
      setMessages(msgs.map(msg => ({
        content: msg.content,
        sender: msg.sender,
        bidAmount: ethers.utils.formatEther(msg.bidAmount),
        timestamp: new Date(msg.timestamp.toNumber() * 1000)
      })))
      
      setMessageCount(count.toNumber())
      setMinBid(ethers.utils.formatEther(minimum))
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const postMessage = async () => {
    if (!account) {
      showNotification('请先连接钱包', 'error')
      return
    }

    if (!newMessage.trim()) {
      showNotification('请输入留言内容', 'error')
      return
    }

    if (parseFloat(bidAmount) <= parseFloat(minBid)) {
      showNotification(`竞价必须大于 ${minBid} ETH`, 'error')
      return
    }

    setLoading(true)
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(CONTRACT_ADDRESS, MessageBoardABI.abi, signer)
      
      const messageId = ethers.utils.id(newMessage + Date.now())
      const tx = await contract.addMessage(newMessage, messageId, {
        value: ethers.utils.parseEther(bidAmount)
      })
      
      showNotification('交易已发送，等待确认...', 'info')
      await tx.wait()
      
      showNotification('留言发布成功！', 'success')
      setNewMessage('')
      setBidAmount('0.01')
      await loadMessages()
    } catch (error) {
      console.error('Error posting message:', error)
      showNotification('发布失败: ' + error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const showNotification = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatTime = (date) => {
    const now = new Date()
    const diff = Math.floor((now - date) / 1000)
    
    if (diff < 60) return `${diff}秒前`
    if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
    if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`
    return `${Math.floor(diff / 86400)}天前`
  }

  return (
    <div className="app">
      <div className="particles"></div>
      
      {/* 通知 */}
      <AnimatePresence>
        {notification && (
          <motion.div
            className={`notification ${notification.type}`}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            {notification.type === 'success' && <CheckCircle size={20} />}
            {notification.type === 'error' && <AlertCircle size={20} />}
            {notification.type === 'info' && <Loader size={20} className="spin" />}
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 头部 */}
      <header className="header">
        <motion.div 
          className="logo"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Flame className="logo-icon" />
          <div>
            <h1>DOOMSDAY</h1>
            <p>末日留言板</p>
          </div>
        </motion.div>

        <motion.button
          className="connect-btn"
          onClick={connectWallet}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Wallet size={20} />
          {account ? formatAddress(account) : '连接钱包'}
        </motion.button>
      </header>

      {/* 统计信息 */}
      <motion.div 
        className="stats"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="stat-card">
          <Trophy className="stat-icon" />
          <div>
            <div className="stat-value">{messageCount}</div>
            <div className="stat-label">总留言数</div>
          </div>
        </div>
        
        <div className="stat-card">
          <Coins className="stat-icon" />
          <div>
            <div className="stat-value">{minBid} ETH</div>
            <div className="stat-label">最低竞价</div>
          </div>
        </div>
        
        <div className="stat-card">
          <Clock className="stat-icon" />
          <div>
            <div className="stat-value">24h</div>
            <div className="stat-label">衰减周期</div>
          </div>
        </div>
      </motion.div>

      {/* 发布留言 */}
      <motion.div 
        className="post-section"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <h2 className="section-title">
          <Flame size={24} />
          发布你的末日留言
        </h2>
        
        <div className="post-form">
          <textarea
            className="message-input"
            placeholder="在末日来临之前，你想说些什么？"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            maxLength={280}
          />
          
          <div className="post-controls">
            <div className="bid-input-group">
              <label>竞价金额 (ETH)</label>
              <input
                type="number"
                className="bid-input"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                step="0.01"
                min="0.01"
              />
            </div>
            
            <motion.button
              className="post-btn"
              onClick={postMessage}
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? (
                <>
                  <Loader className="spin" size={20} />
                  发布中...
                </>
              ) : (
                <>
                  <Send size={20} />
                  发布留言
                </>
              )}
            </motion.button>
          </div>
          
          <div className="post-hint">
            💡 提示：竞价越高，排名越靠前。每24小时竞价衰减50%
          </div>
        </div>
      </motion.div>

      {/* 留言列表 */}
      <motion.div 
        className="messages-section"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <h2 className="section-title">
          <Trophy size={24} />
          Top 100 留言榜
        </h2>
        
        <div className="messages-list">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              className="message-card"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ scale: 1.02, x: 10 }}
            >
              <div className="message-rank">
                <div className={`rank-badge rank-${index < 3 ? index + 1 : 'other'}`}>
                  #{index + 1}
                </div>
              </div>
              
              <div className="message-content">
                <p className="message-text">{msg.content}</p>
                
                <div className="message-meta">
                  <span className="message-author">
                    <Wallet size={14} />
                    {formatAddress(msg.sender)}
                  </span>
                  
                  <span className="message-bid">
                    <Coins size={14} />
                    {msg.bidAmount} ETH
                  </span>
                  
                  <span className="message-time">
                    <Clock size={14} />
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
          
          {messages.length === 0 && (
            <div className="empty-state">
              <Flame size={64} />
              <p>还没有留言，成为第一个发布者吧！</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* 页脚 */}
      <footer className="footer">
        <p>🔥 Doomsday Message Board - 基于以太坊的去中心化留言板</p>
        <p>竞价排名 · 时间衰减 · 完全去中心化</p>
      </footer>
    </div>
  )
}

export default App


