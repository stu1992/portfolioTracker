import React from 'react';
import classNames from 'classnames';
import { SectionTilesProps } from '../../utils/SectionProps';
import SectionHeader from './partials/SectionHeader';
import Headline from './Headline'
import News from '../../backend/model/News'

const propTypes = {
  ...SectionTilesProps.types
}

const defaultProps = {
  ...SectionTilesProps.defaults
}

const Testimonial = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  pushLeft,
  NewsList,
  loggedIn,
  ...props
}) => {

  const outerClasses = classNames(
    'testimonial section',
    topOuterDivider && 'has-top-divider',
    bottomOuterDivider && 'has-bottom-divider',
    hasBgColor && 'has-bg-color',
    invertColor && 'invert-color',
    className
  );

  const innerClasses = classNames(
    'testimonial-inner section-inner',
    topDivider && 'has-top-divider',
    bottomDivider && 'has-bottom-divider'
  );

  const tilesClasses = classNames(
    'tiles-wrap',
    pushLeft && 'push-left'
  );

  const sectionHeader = {
    title: 'News that I\'m following',
    paragraph: 'Log in for more insight'
  };
  const sectionHeaderLoggedIn = {
    title: 'News that you\'re following',
    paragraph: 'specific to your investment preferences'
  };

  return (
    <section
      {...props}
      className={outerClasses}
    >
      <div className="container">
        <div className={innerClasses}>
	  { !loggedIn &&
          <SectionHeader data={sectionHeader} className="center-content" />
	  }
	  { loggedIn &&
	<SectionHeader data={sectionHeaderLoggedIn} className="center-content" />
	  }
          <div className={tilesClasses}>

          {NewsList.map((news) => (<Headline date={news["date"]} headline={news["title"]} comment={news["comment"]} link={news["link"]} tags={news["tags"]}/>))}

          </div>
        </div>
      </div>
    </section>
  );
}

Testimonial.propTypes = propTypes;
Testimonial.defaultProps = defaultProps;

export default Testimonial;

