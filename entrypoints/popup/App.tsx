import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { storage } from 'wxt/storage';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Plus, RotateCw, EllipsisVertical, SquareMenu, AppWindow, Ellipsis } from "lucide-react";

import './App.less';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

// fetch('https://html-parse-dmjyvnodvm.cn-hangzhouvpc.fcapp.run/parse', {
// 	method: 'POST',
// 	headers: {
// 		'Content-Type': 'text/html',
// 		'Authorization': 'Bearer TokenForTestingPurposesOnly'
// 	},
// 	body: '<html><body><h1>Hello, World!</h1></body></html>'
// }).then(res => {
// 	console.log(res)
// })


function App() {
	const [list, setList] = useState([]);
	
	const [isCheck, setIsCheck] = useState(false);
	const [checkids, setCheckids] = useState([]);
	
	const [formdata, setFormdata] = useState({
		title: '',
		content: ''
	})
	
	const [show, setShow] = useState(false);
	const handleMouseEnter = () => {
		setShow(true)
	}
	
	useEffect(() => {
		storage.getItem('local:infolist').then(res => {
			console.log(res)
			setList(res || [])
		})
	}, [])
		
	const handleSelect = (value) => {
		setShow(false)
		console.log(value)
	}
	
	const canCheck = () => {
		if (isCheck) {
			setCheckids([])
			setList(list.map(item => {
				return {
					...item,
					check: false
				}
			}))
		}
		setIsCheck(!isCheck)
	}
	
	
	const handleClickItem = (item) => {
		if (isCheck) {
			let ids = [...checkids]
			let index = ids.indexOf(item.id);
			if (index !== -1) {
				ids.splice(index, 1)
				item.check = false
			} else {
				ids.push(item.id)
				item.check = true
			}
			setCheckids(ids)
		}
	}
	
	const handleChangeTitle = (e) => {
		setFormdata({
			...formdata,
			title: e.target.value
		})
	}

  return (
    <>
			<div className="header">
				<Dialog>
					<DropdownMenu open={show}>
						<DropdownMenuTrigger>
							<Button onMouseEnter={handleMouseEnter}>
								添加<Plus size={20} className="mr-2 h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DialogTrigger asChild>
								<DropdownMenuItem onSelect={() => handleSelect('one')}>速记</DropdownMenuItem>
							</DialogTrigger>
							<DropdownMenuItem onSelect={() => handleSelect('two')}>网址解析</DropdownMenuItem>
							<DropdownMenuItem onSelect={() => handleSelect('three')}>页面截图</DropdownMenuItem>
							<DropdownMenuItem onSelect={() => handleSelect('four')}>上传图片</DropdownMenuItem>
							<DropdownMenuItem onSelect={() => handleSelect('five')}>新文件夹</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>添加速记</DialogTitle>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<div className="grid grid-cols-4 items-center gap-4">
								<Input id="name" value={formdata.title} className="col-span-3" placeholder="请输入标题" onChange={handleChangeTitle}/>
							</div>
							<div className="grid grid-cols-4 items-center gap-4">
								<Input id="username" value={formdata.content} className="col-span-3" placeholder="请输入内容"/>
							</div>
						</div>
						<DialogFooter>
							<Button type="submit">Save changes</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
				<Input type="text" placeholder="搜索" className="search-input"/>
				<div className="tools">
					<RotateCw size={20}/>
					<SquareMenu size={20}/>
					<AppWindow size={20}/>
					<EllipsisVertical size={20}/>
				</div>
			</div>
			<div className="content-wrap">
				{
					list.map(item => {
						return (
							<div className="item" key={item.id} onClick={() => handleClickItem(item)}>
								<Ellipsis size={20} className="rightIcon"/>
								<p className="title">{item.title}</p>
								<div className="bottom">
									<p className="time">{dayjs(item.creatTime).fromNow()}</p>
									<div className="tags">
										{
											item.tags.map(tag => {
												return (
													<p key={tag}>#{tag}</p>
												)
											})
										}
									</div>
								</div>
							</div>
						)
					})
				}
			</div>
    </>
  );
}

export default App;
