import React from 'react';
import Header from '../Header/Header';
import MediaCard from './MediaCard';
import EmptyCard from './EmptyCard';
import CategoryBar from './CategoryBar';
import { inject, observer } from 'mobx-react';
import { useLocation } from 'react-router-dom';
import { Grid, GridList, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    width: '100%',
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  container: {
    marginTop: 5,
  },
}));

const MediaCards = inject(
  'userStore',
  'mediaStore'
)(
  observer((props) => {
    const location = useLocation();
    const classes = useStyles();
    let { isLoggedIn, favorites } = props.userStore;
    let { trending, searchResults } = props.mediaStore;

    const { media, header, mediaCard } =
      location.pathname === '/dashboard' && (!isLoggedIn || !favorites.length)
        ? { media: [], header: 'basic', mediaCard: false }
        : location.pathname === '/dashboard'
        ? { media: favorites, header: 'basic', mediaCard: true }
        : { media: trending, header: 'explore', mediaCard: true };

    const renderMediaCard = (data) => {
      return data.map((d) => {
        return (
          <MediaCard key={d._id} id={d._id} img={d.img} twitchName={d.twitch} />
        );
      });
    };

    return (
      <>
        <Header page={header} />
        {header === 'explore' && <CategoryBar />}
        {mediaCard ? (
          <Grid container className={header === 'explore' && classes.container}>
            <GridList cellHeight={180} className={classes.root}>
              {searchResults.length
                ? renderMediaCard(searchResults)
                : renderMediaCard(media)}
            </GridList>
          </Grid>
        ) : (
          <EmptyCard />
        )}
      </>
    );
  })
);

export default MediaCards;
