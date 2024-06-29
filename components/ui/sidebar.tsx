import React, { useState, useEffect } from 'react';

function Sidebar() {
	// useEffect(() => {}, [])
	// const [isShow, setIsShow] = useState(false)

  return (
		<>
			<div id="joow-sidebar">
				<button id="closeButton" className="close-button">×</button>
				<div id="joow-resizer">
				</div>
				<div id="joow-welcom">
				  <h1>欢迎！😄</h1>
				  <p>拖拽内容可以保存在此😘</p>
				</div>
				<div id="joow-cards-list">
				</div>
				<div id="joow-drop-overlay">
				  <h1>拖拽到此处😚</h1>
				</div>
			</div>
		</>
  );
}

export default Sidebar;
