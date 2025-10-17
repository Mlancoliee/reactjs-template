/**
 * EdgeOne Edge Function - 根路径处理
 * 只处理 / 路径，返回 React 应用首页
 * 
 * 其他路径（包括多层静态资源）不会进入这个函数
 */

export async function onRequest(context) {
  const { request } = context;
  
  try {
    const url = new URL(request.url);
    
    const indexUrl = new URL('/index.html', url.origin);
    const response = await fetch(indexUrl.toString());
    
    if (response.ok) {
      // 返回首页内容
      const newResponse = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      });
      
      newResponse.headers.set('x-edge-function', 'index');
      newResponse.headers.set('x-powered-by', 'EdgeOne Pages');
      
      return newResponse;
    }
    
    // 如果 index.html 不存在
    return new Response('Index file not found', { status: 404 });
    
  } catch (error) {
    console.error('Error in index function:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

