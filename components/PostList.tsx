import type { Post } from '@/lib/types';

export function PostList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return <p className="empty-message">Немає постів</p>;

  return (
    <div className="post-list">
      {posts.map((post) => (
        <article key={post.id} className="post">
          <h4 className="post-title">{post.title}</h4>
          <div className="post-meta">
            Post ID: {post.id} | User ID: {post.userId}
          </div>
          <p className="post-body">{post.body}</p>
        </article>
      ))}
    </div>
  );
}
