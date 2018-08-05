/**
 * Common database helper functions.
 */
class DBHelper {

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = 1337 // Change this to your server port
    return `http://localhost:${port}`;
  }

  /**
   * Create IndexedDB database for JSON responses.
   */
  static openDatabase() {
    if(!navigator.serviceWorker){
      return Promise.resolve();
    }
    return idb.open('db', 2, function (upgradeDb) {
      switch (upgradeDb.oldVersion) {
        case 0:
          upgradeDb.createObjectStore('restaurants', {
            keyPath: 'id'
          });
        case 1:
          const reviewsStore = upgradeDb.createObjectStore('reviews', {
            keyPath: 'id'
          });
          reviewsStore.createIndex('restaurant', 'restaurant_id');
      }
    });
  }

  static populateRestaurantObjectStore(restaurants){
    return DBHelper.openDatabase().then(function(db){
      if(!db) return;

      let tx = db.transaction('restaurants', 'readwrite');
      let store = tx.objectStore('restaurants');
      restaurants.forEach(function (restaurant) {
          store.put(restaurant);
      });
      return tx.complete.then(() => Promise.resolve(restaurants));
    });
  }

  static populateReviewObjectStore(reviews){
    return DBHelper.openDatabase().then(function(db){
      if(!db) return;

      let tx = db.transaction('reviews', 'readwrite');
      let store = tx.objectStore('reviews');
      reviews.forEach(function (review) {
          store.put(review);
      });
      return tx.complete.then(() => Promise.resolve(reviews));
    });
  }


  static getRestaurantsFromDB(){
    return DBHelper.openDatabase().then(function(db){
      if(!db) return;

      let tx = db.transaction('restaurants');
      let store = tx.objectStore('restaurants');
      return store.getAll();
    });
  }

  static getReviewFromDB(restaurantId){
    return DBHelper.openDatabase().then(function(db){
      if(!db) return;
      let tx = db.transaction('reviews');
      let store = tx.objectStore('reviews');
      const indexId = store.index('restaurant');
      return indexId.getAll(restaurantId);
    });
  }

  static getRestaurantsFromNetwork(){
    return fetch(`${DBHelper.DATABASE_URL}/restaurants`)
      .then(function(response){
          return response.json();
      }).then(restaurants => {
          return DBHelper.populateRestaurantObjectStore(restaurants);
      }).catch(function(error) {
        callback(error, null);
      });
  }

  static getReviewsFromNetwork(restaurantId){
    return fetch(`${DBHelper.DATABASE_URL}/reviews/?restaurant_id=${restaurantId}`)
      .then(function(response){
          return response.json();
      }).then(reviews => {
          return DBHelper.populateReviewObjectStore(reviews);
      }).catch(function(error) {
        console.log(error);
        //callback(error, null);
      });
  }

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {
    return DBHelper.getRestaurantsFromDB()
    .then((restaurants) => {
      if (restaurants.length) {
        return restaurants;
      } else {
        return DBHelper.getRestaurantsFromNetwork()
      }
    }).then(restaurants => {
      callback(null, restaurants);
    });
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants;
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant responsive image root URL.
   */
  static imageRootUrl() {
    return (`/dist/img/`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant, resolutionPrefix) {
    const name = restaurant.photograph;
    const rootUrl = DBHelper.imageRootUrl();
    const responsiveImage = `${rootUrl+name+resolutionPrefix}.webp`
    return responsiveImage;
  }

  /**
   * Map marker for a restaurant.
   */
  // static mapMarkerForRestaurant(restaurant, map) {
  //   const marker = new google.maps.Marker({
  //     position: restaurant.latlng,
  //     title: restaurant.name,
  //     url: DBHelper.urlForRestaurant(restaurant),
  //     map: map,
  //     animation: google.maps.Animation.DROP}
  //   );
  //   return marker;
  // }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    // https://leafletjs.com/reference-1.3.0.html#marker  
    const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng],
      {title: restaurant.name,
      alt: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant)
      })
      marker.addTo(newMap);
    return marker;
  }

  static addReview(review) {
    let offline_obj = {
      name: 'addReview',
      data: review,
      object_type: 'review'
    };
    // Check if online
    if (!navigator.onLine && (offline_obj.name === 'addReview')) {
      DBHelper.handleOfflineReview(offline_obj);
      return;
    }
    let reviewSend = {
      "name": review.name,
      "rating": parseInt(review.rating),
      "comments": review.comments,
      "restaurant_id": parseInt(review.restaurant_id)
    };
    let fetch_options = {
      method: 'POST',
      body: JSON.stringify(reviewSend),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    };
    fetch(`${DBHelper.DATABASE_URL}/reviews`, fetch_options).then((response) => {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        return response.json();
      } else { return 'API call successfull'}})
    .then((data) => {console.log(`Fetch successful!`)})
    .catch(error => console.log('error:', error));
  }

  static handleOfflineReview(offline_obj) {
    console.log('Offline OBJ', offline_obj);
    localStorage.setItem('data', JSON.stringify(offline_obj.data));
    console.log(`Local Storage: ${offline_obj.object_type} stored`);
    window.addEventListener('online', (event) => {
      console.log('Browser: Online again!');
      let data = JSON.parse(localStorage.getItem('data'));
      console.log('updating and cleaning ui');
      [...document.querySelectorAll(".reviews_offline")]
      .forEach(el => {
        el.classList.remove("reviews_offline")
        el.querySelector(".offline_label").remove()
      });
      if (data !== null) {
        console.log(data);
        if (offline_obj.name === 'addReview') {
          DBHelper.addReview(offline_obj.data);
        }

        console.log('LocalState: data sent to api');

        localStorage.removeItem('data');
        console.log(`Local Storage: ${offline_obj.object_type} removed`);
      }
    });
  }

  static updateFavouriteStatus(restaurantId, isFavourite) {
    fetch(`${DBHelper.DATABASE_URL}/restaurants/${restaurantId}/?is_favorite=${isFavourite}`, {
        method: 'PUT'
      })
    .then(() => {
      this.openDatabase()
        .then(db => {
          const tx = db.transaction('restaurants', 'readwrite');
          const restaurantsStore = tx.objectStore('restaurants');
          restaurantsStore.get(restaurantId)
            .then(restaurant => {
              restaurant.is_favorite = isFavourite;
              restaurantsStore.put(restaurant);
            });
        })
    })
  }

  static fetchReviewByRestaurantId(restaurantId) {
    return DBHelper.getReviewFromDB(restaurantId)
    .then((reviews) => {
      if (reviews.length) {
        return reviews;
      } else {
        return DBHelper.getReviewsFromNetwork(restaurantId);
      }
    })
  }

}


