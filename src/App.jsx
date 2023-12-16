// import React, { useState } from 'react';
// import axios from 'axios';
// import ReactPlayer from 'react-player/youtube';

// const App = () => {
//   const [videoId, setVideoId] = useState('');
//   const [player, setPlayer] = useState(null);

//   const onVideoIdChange = (event) => {
//     setVideoId(event.target.value);
//   };

//   const loadVideo = async () => {
//     try {
//       const response = await axios.get(
//         `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=AIzaSyCTdZ8ptXRWksNDRrr2RwuQA-aiJUQiOxk&part=snippet`
//       );
 
//       if (response.data.items.length === 0) {
//         throw new Error('Video not found.');
//       }
  
//       const videoTitle = response.data.items[0].snippet.title;
//       alert(`Loading video: ${videoTitle}`);

//       if (player) {
//         console.log('player exists');
//         player.loadVideoById(videoId);
//       }
//     } catch (error) {
//       console.log('we are here');
//       console.error('Error loading video:', error.message);
//     }
//   };

//   const onPlayerReady = (event) => {
//     // Do something when the player is ready
//   };

//   const onPlayerStateChange = (event) => {
//     // Do something when the player state changes
//   };

//   return (
//     <div>
//       <h1>YouTube Video Player</h1>
//       <input
//         type="text"
//         placeholder="Enter YouTube Video ID"
//         value={videoId}
//         onChange={onVideoIdChange}
//       />
//       <button onClick={loadVideo}>Load Video</button>
//       {videoId && (
//         <ReactPlayer
//           url={`https://www.youtube.com/watch?v=${videoId}`}
//           controls
//           playing
//           width="100%"
//           height="360px"
//           onReady={onPlayerReady}
//           onStateChange={onPlayerStateChange}
//         />
//       )}
//     </div>
//   );
// };

// export default App;
import React, { useState, useEffect } from 'react';
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
  };

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
  }, [keyword]);

  const onVideoSelect = (videoId) => {
    setSelectedVideoId(videoId);
  };

  return (
    <div>
      <h1>YouTube Video Player</h1>
      <input
        type="text"
        placeholder="Enter a keyword"
        value={keyword}
        onChange={onKeywordChange}
      />
      <Button variant="primary" onClick={searchVideos}>
        Search Videos
      </Button>

      {selectedVideoId && (
        <ReactPlayer
          url={`https://www.youtube.com/watch?v=${selectedVideoId}`}
          controls
          playing
          width="100%"
          height="360px"
        />
      )}

      <div>
        <h2>Related Videos:</h2>
        <div className="card-container">
          {videos.map((video) => (
            <Card key={video.id.videoId} style={{ width: '18rem' }} className="mb-3">
              <Card.Img variant="top" src={video.snippet.thumbnails.default.url} />
              <Card.Body>
                <Card.Title>{video.snippet.title}</Card.Title>
                <Card.Text>{video.snippet.description}</Card.Text>
                <Button variant="primary" onClick={() => onVideoSelect(video.id.videoId)}>
                  Watch
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
