'use client'
import { useState, useEffect } from 'react'
import PromptCard from './PromptCard'
import { useSearchParams } from 'next/navigation'

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className='mt-16 prompt_layout'>
      {data.map((post) => (
        <PromptCard
          key={post.id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  )
}

const Feed = () => {
  const [posts, setPosts] = useState([])
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);




  const fetchPosts = async () => {
    const res = await fetch('/api/prompt')
    const data = await res.json()
    setPosts(data)
  }

  useEffect(() => {
    fetchPosts()
  }, [])


  const filterPrompts = (searchText) => {
    const regex = new RegExp(searchText, 'i')
    return posts.filter((item) => (
      regex.test(item.creator.username) ||
      regex.test(item.tag) ||
      regex.test(item.prompt)
    ))
  }

  const handleSearchChange = async (e) => {
    clearTimeout(searchTimeout)

    setSearchText(e.target.value)

    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts(e.target.value)
        setSearchedResults(searchResult)
      }, 500)
    )
  }

  const handleTagClick = (tagName) => {
    setSearchText(tagName);

    const searchResult = filterPrompts(tagName);
    setSearchedResults(searchResult);
  };


  return (
    <section className='feed'>
      <form
        className='relative w-full flex-center'
      >
        <input
          type="text"
          placeholder='Search for a tag or username'
          value={searchText}
          onChange={handleSearchChange}
          required
          className='search_input peer'
        />
      </form>

      {searchText ? (
        <PromptCardList
          data={searchedResults}
          handleTagClick={() => { }}
        />
      ) :
        (
          <PromptCardList data={posts} handleTagClick={handleTagClick} />
        )}
    </section>
  )
}

export default Feed