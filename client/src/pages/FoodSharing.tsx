import React, { useEffect, useState } from 'react'
import { getComments, addComment, deleteComment } from '../services/api'
import useAsync from '../hooks/useAsync'

export default function FoodSharing() {
  const [comments, setComments] = useState<any[]>([])
  const [form, setForm] = useState({ comment_author: '', contact: '', date: '', pwrd: '', comment: '' })
  const [success, setSuccess] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const { loading, error, run } = useAsync()

  // Load comments
  useEffect(() => {
    run(() => getComments()).then(setComments).catch(err => {
      console.error(err)
      setErrorMsg('Failed to load comments')
    })
  }, [run])

  // Submit new comment
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await run(() => addComment(form))
      window.location.reload()
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to post')
    }
  }

  // Remove comment
  const remove = async (e: React.FormEvent) => {
    e.preventDefault()
    const fd = new FormData(e.target as HTMLFormElement)
    const data: any = {}
    fd.forEach((v, k) => { data[k] = v })
    try {
      await run(() => deleteComment(data))
      // After successful delete, refresh the page
      window.location.reload()
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to remove post')
    }
  }

  return (
    <div className="outer">
      <div id="respond">
        <h2 className="section-heading">Share your food:</h2>
        <form id="commentform" onSubmit={submit} aria-label="Post food share">
          <label className="form-label" htmlFor="author">Name</label>
          <input id="author" required value={form.comment_author} onChange={e => setForm({ ...form, comment_author: e.target.value })} name="comment_author" />
          <label className="form-label" htmlFor="contact">Contact</label>
          <input id="contact" required value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} name="contact" />
          <label className="form-label" htmlFor="date">Expiration Date</label>
          <input id="date" required type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} name="date" />
          <label className="form-label" htmlFor="pwrd">Password</label>
          <input id="pwrd" required value={form.pwrd} onChange={e => setForm({ ...form, pwrd: e.target.value })} name="pwrd" />
          <label className="form-label" htmlFor="comment">Description</label>
          <textarea id="comment" required value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })} name="comment" />
          <input type="submit" value="Submit" aria-label="Submit post" />
        </form>

        <hr />

        <h2 className="section-heading">Take down your post:</h2>
        <form id="commentform2" onSubmit={remove} aria-label="Remove post">
          <label className="form-label" htmlFor="postID">Post ID</label>
          <input id="postID" name="postID" required />
          <label className="form-label" htmlFor="delpw">Password</label>
          <input id="delpw" name="Password" required />
          <input type="submit" value="Submit" aria-label="Remove post" />
        </form>

        <p>Please handle food responsibly. We claim no liability for any misuse of our service.</p>
      </div>

      <div id="comments-list">
        <h2 className="section-heading">Free food opportunities:</h2>
        {loading && <p>Loading comments...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {errorMsg && <p role="status" aria-live="assertive" style={{ color: 'red' }}>{errorMsg}</p>}
        {success && <p role="status" aria-live="polite" style={{ color: 'green' }}>{success}</p>}
        <ul id="posts-list" className={comments.length ? 'hfeed has-comments' : 'hfeed'}>
          {!loading && comments.length === 0 && <li className="no-comments">Be the first to share your food.</li>}
          {comments.map((c, idx) => (
            <li key={c.id} className="comment-list-item">
              <div className="comment-card">
                <footer className="post-info">
                  <div className="published">Expires {new Date(c.date).toLocaleDateString()}</div>
                  <address className="labelled"><strong>Name:</strong> {c.author}</address>
                  <address className="labelled"><strong>Contact:</strong> {c.contact}</address>
                  <address className="labelled"><strong>post id:</strong> {c.id}</address>
                </footer>
                <div className="contentDiv"><p>{c.comment}</p></div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
