import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Header from './components/header.jsx';
import Footer from './components/footer.jsx';
import Home from './pages/homePage.jsx';
import Submit from './pages/submitPage.jsx';
import Account from './pages/accountPage.jsx';
import Story from './pages/storyPage.jsx';
import ErrorBoundary from './pages/errorBoundaryPage.jsx';

import auth from './auth.js';



class StoryBoardApp extends React.Component {
	constructor(properties)
	{
		super(properties);
	}

	render() {
		return (
			<BrowserRouter>
				<div className='full-height'>
					<Route component={Header}/>
					<main className='main'>
						<ErrorBoundary>
							<Switch>
								<Route exact path='/' component={Home}/>
								<Route exact path='/submit' component={Submit}/>
								<Route exact path='/account' component={Account}/>
								<Route exact path='/story/:storyId' component={Story}/>
							</Switch>
						</ErrorBoundary>
					</main>
					<Footer/>
				</div>
			</BrowserRouter>
		);
	}

}




(function InitApp(){
	document.addEventListener('DOMContentLoaded', function(){
		auth.init();
		const appContainer = document.getElementById('root');
		ReactDOM.render(<StoryBoardApp/>, appContainer);

	});
})();


export default StoryBoardApp;





