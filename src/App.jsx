// export default App;
import React, { useState, useEffect } from 'react';
import './App.css';
import ReactPlayer from 'react-player/youtube';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const App = () => {
  const [keyword, setKeyword] = useState('');
  const [videos, setVideos] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState('');

  const onKeywordChange = (event) => {
    setKeyword(event.target.value);
  };2

  const searchVideos = async () => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?key=AIzaSyCTdZ8ptXRWksNDRrr2RwuQA-aiJUQiOxk&part=snippet&q=${keyword}&type=video&maxResults=10`
      );

      if (response.data.items.length === 0) {
        throw new Error('No videos found for the given keyword.');
      }

      setVideos(response.data.items);
      setSelectedVideoId(response.data.items[0].id.videoId);
    } catch (error) {
      console.error('Error searching videos:', error.message);
    }
  };

  useEffect(() => {
    if (keyword.trim() !== '') {
      searchVideos();
    }
  }, []);

  const onVideoSelect = (videoId) => {
    setSelectedVideoId(videoId);
  };

  return (
    <div className="App">
    <div className="head">
      <div className="serchbox"><h1 >VideoVista</h1>
      <input
        type="text"
        placeholder="Enter a keyword"
        value={keyword}
        onChange={onKeywordChange}
      />
      <Button variant="primary" onClick={searchVideos}>
        Search Videos
      </Button></div>
      
      <div className="video">

      {selectedVideoId && (
        <ReactPlayer
        url={`https://www.youtube.com/watch?v=${selectedVideoId}`}
        controls
        playing
        width="60%"
        height="600px"
        />
        )}
        </div>

      <div className="sidebar">
        {!selectedVideoId ? <><h2>Search for something...</h2></>:<><h2>Related Videos:</h2></>}
        
        <div className="card-container">
          {videos.map((video) => (
            <Card key={video.id.videoId} style={{ width: '18rem' }} className="mb-3">
               <Button variant="primary" onClick={() => onVideoSelect(video.id.videoId)}>
                <Card.Img variant="top" src={video.snippet.thumbnails.default.url} />
                </Button>
              <Card.Body>
                <Card.Title>{video.snippet.title}</Card.Title>
                {/* <Card.Text>{video.snippet.description}</Card.Text> */}
               
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};

export default App;