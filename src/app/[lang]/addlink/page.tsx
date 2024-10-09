'use client'
import React, { useState } from 'react';
import { createFriendlyLink, fetchLinkInfo } from '@/actions/link';
import { useAuth } from '@/lib/auth';

const istest = false;

export default function AddLink() {
  const [url, setUrl] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [linkInfo, setLinkInfo] = useState({ title: '', description: '', logo: '', containsCheckUrl: false});
  const [errorMessage, setErrorMessage] = useState('');
  const checkurl = process.env.ROOT_URL || 'https://chatsaas.net';
  const {userId} = useAuth();

  const handleUrlCheck = async () => {
    if (url) {
      const fetchedInfo = await fetchLinkInfo(url, checkurl);
      setLinkInfo(fetchedInfo as any);
      if (!istest && !fetchedInfo.containsCheckUrl) {
        setErrorMessage(`您的网站需先添加友情链接${checkurl}，检测通过后才能提交`);
      }else{
        setIsVerified(true);
      }
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 这里添加最终提交的逻辑
    console.log('提交的链接信息:', { url, ...linkInfo });
    // 添加错误处理逻辑
    if (!isVerified) {
      setErrorMessage('请先验证您的网址');
    } else if (!linkInfo.title || !linkInfo.description || !linkInfo.logo) {
      setErrorMessage('请填写所有必填字段');
    } else {
      setErrorMessage(''); // 清除错误信息
      // 执行提交操作
    }
    // 使用正则表达式检查logo是否为合法网址，并且后缀为ico、png或jpg
    const logoRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\.(ico|png|jpg)$/i;
    if (!logoRegex.test(linkInfo.logo)) {
      setErrorMessage('Logo 必须是合法的网址，且文件格式必须为 .ico、.png 或 .jpg');
      return;
    }

    const fetchedInfo = await fetchLinkInfo(url, checkurl);
    if (!istest && !fetchedInfo.containsCheckUrl) {
      setErrorMessage(`您的网站需先添加友情链接${checkurl}，然后再提交，感谢你的支持`);
      return;
    }

    try {
      const newLink = await createFriendlyLink({
        url: url,
        name: linkInfo.title,
        description: linkInfo.description,
        logo: linkInfo.logo,
        creatorId: userId || ''
      });
      setErrorMessage('创建友情链接成功，感谢支持!!!');
    } catch (error) {
      console.error('创建友情链接时出错:', error);
      setErrorMessage('创建友情链接失败:' + error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-center">自助交换友情链接</h1>
        <div className="mb-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 text-sm">
          <p className="font-bold">注意事项：</p>
          <ul className="list-disc list-inside">
            <li>请确保您的网站已添加我们的友情链接（{checkurl}）</li>
            <li>输入您的网址后，点击检测按钮进行验证, 验证通过后，再提交</li>
            <li>你提交的网站必须是相同类型或AI类型网站，请不要提交任何违法违规网站，否则会被删除且不予告知</li>
          </ul>
        </div>
        <form onSubmit={handleFinalSubmit}>
          <div className="mb-4">
            <label htmlFor="url" className="block mb-2">网址：</label>
            <div className="flex">
              <input
                type="url"
                id="url"
                name="url"
                required
                className="flex-grow px-3 py-2 border rounded-l-md"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <button
                type="button"
                onClick={handleUrlCheck}
                className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition-colors duration-300"
              >
                检测
              </button>
            </div>
          </div>
          
          {isVerified && (
            <>
              <div className="mb-4">
                <label htmlFor="title" className="block mb-2">标题：</label>
                <input type="text" id="title" name="title" required 
                       className="w-full px-3 py-2 border rounded-md"
                       value={linkInfo.title}
                       onChange={(e) => setLinkInfo({...linkInfo, title: e.target.value})} />
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block mb-2">描述：</label>
                <textarea id="description" name="description" rows={3} 
                          className="w-full px-3 py-2 border rounded-md"
                          value={linkInfo.description}
                          onChange={(e) => setLinkInfo({...linkInfo, description: e.target.value})}></textarea>
              </div>
              
              <div className="mb-6">
                <label htmlFor="logo" className="block mb-2">Logo路径：</label>
                <input type="text" id="logo" name="logo" 
                       className="w-full px-3 py-2 border rounded-md"
                       value={linkInfo.logo}
                       onChange={(e) => setLinkInfo({...linkInfo, logo: e.target.value})} />
              </div>
            </>
          )}
          {errorMessage && (
            <p className="my-2 text-red-500 text-sm">{errorMessage}</p>
          )}
          <button type="submit" 
                  disabled={!isVerified || !linkInfo.title || !linkInfo.description || !linkInfo.logo }
                  className={`w-full py-3 rounded-md text-white transition-all duration-300 ${
                    !isVerified || !linkInfo.title || !linkInfo.description || !linkInfo.logo  
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                  }`}>
            提交
          </button>
          
          
        </form>
      </div>
    </div>
  );
}


