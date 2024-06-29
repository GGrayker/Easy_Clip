import { storage } from 'wxt/storage';
import dayjs from 'dayjs';

export default defineBackground(() => {
	let db;
	const request = indexedDB.open('sidebarDB', 1);
	var data_changed = false; // 初始化 data_changed 变量

	request.onupgradeneeded = function (event) {
		db = event.target.result;
		// 创建一个名为 contents 的对象存储空间，用于存储侧边栏的内容
		db.createObjectStore('contents', { keyPath: 'id', autoIncrement: true });
	};

	request.onsuccess = function (event) {
		db = event.target.result;
	};

	request.onerror = function (event) {
		console.error("IndexedDB error:", event.target.errorCode);
	};

	// 处理从 content.js 接收的消息，保存、加载、修改、删除内容到 IndexedDB
	browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
		if (request.action === 'saveContent') {
			const transaction = db.transaction(['contents'], 'readwrite');
			const objectStore = transaction.objectStore('contents');
			const newItem = { content: request.content };
			data_changed = true; // 标记数据变更
			objectStore.add(newItem).onsuccess = function (event) {
				sendResponse({ message: 'Content saved successfully' });
			};
		} else if (request.action === 'loadContent') {
			const transaction = db.transaction(['contents'], 'readonly');
			const objectStore = transaction.objectStore('contents');
			const getContent = objectStore.getAll();
			getContent.onsuccess = function (event) {
				sendResponse({ contents: event.target.result });
			};
		} else if (request.action === 'updateContent') {
			const transaction = db.transaction(['contents'], 'readwrite');
			const objectStore = transaction.objectStore('contents');
			const updatedItem = { id: request.id, content: request.content };
			objectStore.put(updatedItem).onsuccess = function (event) {
				sendResponse({ message: 'Content updated successfully' });
				data_changed = false; // 标记数据变更
			};
		} else if (request.action === 'deleteContent') {
			const transaction = db.transaction(['contents'], 'readwrite');
			const objectStore = transaction.objectStore('contents');
			data_changed = true; // 标记数据变更
			objectStore.delete(request.id).onsuccess = function (event) {
				sendResponse({ message: 'Content deleted successfully' });
			};
		} else if (request.action === 'heartbeat') {
			sendResponse({ updateNeeded: data_changed });
		}

		return true; // 保证 sendResponse 在异步操作完成后仍能被调用
	});
	console.log('Hello background!', { id: browser.runtime.id });
	browser.contextMenus.create({
		id: 'checkText',
		title: '保存所选内容到简藏',
		contexts: ['selection']
	});

	browser.contextMenus.create({
		id: 'checkPage',
		title: '保存当前页面到简藏',
		contexts: ['page']
	});

	browser.contextMenus.onClicked.addListener(async (info, tab) => {
		if (info.menuItemId === 'checkText') {
			let infoList = await storage.getItem('local:infolist');
			let newList = infoList ? infoList : [];
			newList.push({
				title: tab.title,
				content: info.selectionText,
				creatTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
				tags: []
			})
			storage.setItem('local:infolist', newList);
		}
		if (info.menuItemId === 'checkPage') {
			console.log(info.pageUrl, document)
		}
	});
});