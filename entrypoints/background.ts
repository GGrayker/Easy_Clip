import { storage } from 'wxt/storage';
import dayjs from 'dayjs';

export default defineBackground(() => {
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