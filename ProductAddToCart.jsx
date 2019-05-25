import React from "react";
import * as productService from "../../services/products/productService";
import * as cartDataService from "../../services/cartDataService";
import Rating from "react-rating";
import SweetAlertWarning from "../ui/SweetAlertWarning";
import PropTypes from "prop-types";
import logger from "../../logger";
import Comments from "../comments/Comments";
import * as commentService from "../../services/commentService";
import styles from "../cart/ProductAddtoCart.module.css";

const _logger = logger.extend("ProductAddToCart");

class ProductAddToCart extends React.Component {
  constructor(props) {
    super(props);
    const newString = window.location;
    const newArray = newString.pathname.split("/");
    this.state = {
      merchantId: newArray[2],
      productId: newArray[3],
      product: {},
      quantity: 1,
      addedToCart: false
    };
  }

  componentDidMount() {
    this.getProductDetails(this.state.productId);
    this.getComments(this.state.productId);
    window.sessionStorage.removeItem("cachedProductUrl");
  }

  getProductDetails = id => {
    productService
      .getByIdProduct(id)
      .then(this.getProductSuccess)
      .catch(this.getProductError);
  };

  getProductSuccess = res => {
    this.setState({
      product: res.item
    });
  };

  getProductError = err => {
    _logger(err);
  };

  addToCart = () => {
    const payload = {
      quantity: this.state.quantity,
      shipping: 0.0,
      totalItemPrice: this.state.product.currentPrice,
      tax: 0.9,
      billingAddressId: 346,
      shippingAddressId: 346,
      paymentTokenId: 1
    };

    cartDataService
      .addToCartMerchant(this.state.merchantId, this.state.productId, payload)
      .then(this.addToCartSuccess)
      .catch(this.addToCartError);
  };

  addToCartSuccess = () => {
    this.setState({
      addedToCart: true
    });
  };

  addToCartError = err => {
    _logger(err);
  };

  sweetAlertConfirm = () => {
    this.setState(
      {
        addedToCart: false
      },
      this.props.history.push("/cart")
    );
  };

  eventHandler = e => {
    this.setState({
      quantity: e.target.value
    });
  };
  getComments = entityId => {
    commentService
      .getByEntityId(entityId, 1)
      .then(this.getByEntityIdSuccess)
      .catch(this.getByEntityIdError);
  };
  getByEntityIdSuccess = response => {
    _logger(response);
    const comments = response.items;
    this.setState({
      selectedComments: comments
    });
  };
  getByEntityIdError = error => {
    _logger(error);
  };
  updateArr = selectedComments => {
    this.setState({ selectedComments });
  };

  render() {
    return (
      <React.Fragment>
        <div className="page-content container-fluid">
          <div className="row justify-content-center">
            <div className="col-12">
              <div className="card pt-4 pl-4 pb-4 pr-3 pt-4">
                <div className="row">
                  <div className="col-lg-6 ">
                    <img
                      // width="70%"
                      className={styles.image}
                      src={this.state.product.mainImage}
                      alt="Product"
                    />
                  </div>
                  <div className="col-lg-6 pr-4 pl-4">
                    <h4>{this.state.product.title}</h4>
                    <h5>
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD"
                      }).format(this.state.product.currentPrice)}
                    </h5>

                    <p>
                      <Rating
                        name="rating"
                        initialRating={this.state.rating}
                        emptySymbol="far fa-star"
                        fullSymbol="fas fa-star"
                        readonly
                      />
                    </p>
                    {/* <small className="text-muted p-t-30 db">Quantity</small>
                    <h6>{this.state.product.quantity}</h6> */}

                    <h6 className="text-muted p-t-30 db">Description</h6>
                    <p>
                      {this.state.product.description} <br />
                      <small>Product Sku: {this.state.product.sku}</small>
                    </p>
                    {/* <small className="text-muted p-t-30 db">Base Tax</small>
                    <h6>{this.state.product.baseTax}</h6> */}
                    <small>Quantity </small>
                    <select
                      name="quantity"
                      className={`${styles.quantity} custom-select`}
                      defaultValue={this.state.quantity}
                      onChange={this.eventHandler}
                    >
                      <option value="1" className="form-control">
                        1
                      </option>
                      <option value="2" className="form-control">
                        2
                      </option>
                      <option value="3" className="form-control">
                        3
                      </option>
                      <option value="4" className="form-control">
                        4
                      </option>
                      <option value="5" className="form-control">
                        5
                      </option>
                      <option value="6" className="form-control">
                        6
                      </option>
                      <option value="7" className="form-control">
                        7
                      </option>
                      <option value="8" className="form-control">
                        8
                      </option>
                      <option value="9" className="form-control">
                        9
                      </option>
                      <option value="10" className="form-control">
                        10
                      </option>
                    </select>
                    <br />
                    <br />
                    <div className="text-center pb-3">
                      <button
                        type="button"
                        className={`${styles.button} btn btn-success`}
                        onClick={() => this.addToCart()}
                      >
                        Add To Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>{" "}
            </div>{" "}
            {this.state.addedToCart && (
              <SweetAlertWarning
                title="Item Added to cart!"
                type="success"
                confirmAction={this.sweetAlertConfirm}
                message="You have added this item! You will be redirected to your cart."
              />
            )}{" "}
          </div>{" "}
          <center>
            <div className="col-12">
              <Comments
                entityId={this.state.productId}
                entityTypeId={1}
                commentsArr={this.state.selectedComments}
                updateArr={this.updateArr}
                selectedId={this.state.entityId}
                getComments={this.getComments}
              />
            </div>
          </center>
        </div>
      </React.Fragment>
    );
  }
}

ProductAddToCart.propTypes = {
  history: PropTypes.object
};

export default ProductAddToCart;
