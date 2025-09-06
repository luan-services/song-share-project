export const SongContainer = ({onShare, songList}) => {
  return (
    <div className="">
      {songList.map((song) => {
        return (
          <div>
            <div>{song.track}</div>
            <button type="button" onClick={() => onShare(song)}>share</button>
          </div>
        );
      })}
    </div>
  )
}
