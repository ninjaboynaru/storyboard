import React from 'react';
import { Link } from 'react-router-dom';
import sitelinks from '../../config/sitelinks.json';


class Footer extends React.Component {
	constructor(properties)
	{
		super(properties);
	}

	render()
	{
		const columnClass = 'footer__column';
		const entryClass = 'footer__column__entry';
		const titleClass = 'footer__column__title';
		
		let links = sitelinks.navigation.map(function(link, index){
			return (
				<Link to={link.path} className='footer__column__link' key={link.path+index}>
					{link.text}
				</Link>
			);
		}, this);
		links.unshift(<p key='links-title' className={titleClass}>Links</p>);


		let footerColumns = [];
		
		footerColumns.push(<div key='links' className={columnClass}>{links}</div>);
		
		footerColumns.push(<div key='developer' className={columnClass}>
				<p className={titleClass}>Thiago HPC</p>
				<p className={entryClass}>Design</p>
				<p className={entryClass}>Frontend</p>
				<p className={entryClass}>Backedn</p>
			</div>);
		footerColumns.push(<div key='stack' className={columnClass}>
				<p className={titleClass}>Stack</p>
				<p className={entryClass}>MongoDB (Mongoose)</p>
				<p className={entryClass}>Node JS (Express)</p>
				<p className={entryClass}>React</p>
			</div>);

		return (
			<div className='footer'>
				{footerColumns}
			</div>
		);
	}
}

export default Footer;
