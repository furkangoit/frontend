
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Yanlış: import { AuthContext, SocketContext } from './context';

import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';
import NotificationToast from './components/NotificationToast';
import io from 'socket.io-client';



import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';


function App() {
	const [notifications, setNotifications] = useState([]);
	const [socket, setSocket] = useState(null);

	useEffect(() => {
		// Socket bağlantısını kur
		const newSocket = io('http://localhost:5000');
		setSocket(newSocket);

		// Bildirim dinleyicisi
		newSocket.on("new-notification", (notification) => {
			console.log("🔔 Yeni bildirim:", notification);
			setNotifications(prev => [notification, ...prev]);
			// 5 saniye sonra otomatik kaldır
			setTimeout(() => {
				setNotifications(prev => prev.filter(n => n !== notification));
			}, 5000);
		});

		return () => {
			newSocket.close();
		};
	}, []);

	const handleRemoveNotification = (notificationToRemove) => {
		setNotifications(prev => prev.filter(n => n !== notificationToRemove));
	};

	return (
		<AuthProvider>
			<SocketProvider>
				<Router>
					<Navbar notifications={notifications} />

					{/* Bildirim Toast'ları */}
					<div className="fixed top-4 right-4 z-50 space-y-2">
						{notifications.map((notification, index) => (
							<NotificationToast
								key={`${notification.timestamp}-${index}`}
								notification={notification}
								onClose={() => handleRemoveNotification(notification)}
							/>
						))}
					</div>

					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/explore" element={<Explore />} />
						<Route path="/profile" element={<Profile />} />
						<Route path="/messages" element={<Messages />} />
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
					</Routes>
				</Router>
			</SocketProvider>
		</AuthProvider>
	);
}


export default App;