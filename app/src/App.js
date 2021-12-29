// front end react code to render and interact with EXPRESS REST API endpoints

import './App.css'; // this will give error unless we added in package.json {"type": "module"}
// we use react-tinder-card which allows for swiping files/graphics.
//   Thoss will interact with app functions to handle events, e.g. onSwipe
//   handleLikeClick, showDetails and componentWillMount (show data on page load)
import TinderCard from 'react-tinder-card';
// functions onSwipe, handleLikeClick, and componentWillMount will use axios lib. to
//   perform http REST API requests to our Express server. Thos in turn will perform
//   the needed action on our Atlas cluster.
import axios from 'axios';
import React, { Component } from 'react';
import { v4 as uuid } from 'uuid';

class App extends Component {
    constructor() {
        super();

        this.state = {
            data: [],
            session_id: uuid(),
            liked: false
        };
        this.handleClick = this.handleClick.bind(this);
        this.showDetails = this.showDetails.bind(this);
    }

    async onSwipe(direction, listingId, sessionId) {
        this.setState({
            liked: false
        });

        if (direction === 'left') {
            await axios.delete(`http://localhost:5000/listings/delete/${listingId}`);
        } else {
            await axios.post('http://localhost:5000/listings/recordSwipe', { id: listingId, session_id: sessionId, direction });
        }
    }

    async handleClick(listingId) {
        this.setState({
            liked: !this.state.liked
        });

        await axios.post('http://localhost:5000/listings/updateLike', { id: listingId });
    }

    showDetails(listing) {
        alert(`Name: ${listing.name}\n Price: $${listing.price['$numberDecimal']} \n Minimum Nights: ${listing.minimum_nights}\n Beds: ${listing.beds}`);
    }

    async componentWillMount() {
        const response = await axios.get(`http://localhost:5000/listings`);
        const json = await response.data;
        this.setState({ data: json });
    }

    render() {
        const likeButtonLabel = this.state.liked ? '❤' : 'Like';

        return (
            <div className='app'>
                <div>
                    <h1>LisTinder</h1>
                    <h2>Swipe left for drop or right to save...</h2>

                    <div className='card-container'>
                        {this.state.data.map((listing) =>
                            <TinderCard className='swipe' key={listing.name} onSwipe={(dir) => this.onSwipe(dir, listing._id)} >
                        <div style={{ backgroundImage: 'url(' + listing.images.picture_url + ')', }} className='card'>
                            <div className='card-details'>
                                <h3>{listing.name}</h3>
                                <div className='card-actions'>
                                    <button className='button' onClick={() => this.handleClick(listing._id)}>{likeButtonLabel}</button>
                                    <button className='button' onClick={() => this.showDetails(listing)}>See Details</button>
                                </div>
                            </div>
                        </div>
                    </TinderCard>
                    )}
                </div>
            </div>
        </div>
        );
    }
}

export default App;
