
var GeoUtils = {}


/**
 * 判断点是否多边形内
 * @param {Point} point 点对象 例如: {lng:114,lat:40}
 * @param {Object} polygon 多边形点的对象数组 例如: [{lng:114,lat:40},{lng:114.2,lat:40.1}]
 * @returns {Boolean} 点在多边形内返回true,否则返回false
 */
function isPointInPolygon (point, polygon) {
	if(!point || point.length<2) {
		console.error('坐标点格式错误')
		return false;
	}
	if(!polygon || polygon.length<4) {
		console.error('多边形格式错误')
		return false;
	}

	var pts = JSON.parse(JSON.stringify(polygon));
	//下述代码来源：http://paulbourke.net/geometry/insidepoly/，进行了部分修改
	//基本思想是利用射线法，计算射线与多边形各边的交点，如果是偶数，则点在多边形外，否则
	//在多边形内。还会考虑一些特殊情况，如点在多边形顶点上，点在多边形边上等特殊情况。

	var boundOrVertex = true; //如果点位于多边形的顶点或边上，也算做点在多边形内，直接返回true
	var intersectCount = 0; //cross points count of x
	var precision = 2e-10; //浮点类型计算时候与0比较时候的容差
	var p1, p2; //neighbour bound vertices
	var p = point; //测试点
	var N = pts.length;

	p1 = pts[0]; //left vertex
	for (var i = 1; i <= N; ++i) { //check all rays
		if (p.lat == p1.lat && p.lng ==p1.lng) {
			return boundOrVertex; //p is an vertex
		}

		p2 = pts[i % N]; //right vertex
		if (p.lat < Math.min(p1.lat, p2.lat) || p.lat > Math.max(p1.lat, p2.lat)) { //ray is outside of our interests
			p1 = p2;
			continue; //next ray left point
		}

		if (p.lat > Math.min(p1.lat, p2.lat) && p.lat < Math.max(p1.lat, p2.lat)) { //ray is crossing over by the algorithm (common part of)
			if (p.lng <= Math.max(p1.lng, p2.lng)) { //x is before of ray
				if (p1.lat == p2.lat && p.lng >= Math.min(p1.lng, p2.lng)) { //overlies on a horizontal ray
					return boundOrVertex;
				}

				if (p1.lng == p2.lng) { //ray is vertical
					if (p1.lng == p.lng) { //overlies on a vertical ray
						return boundOrVertex;
					} else { //before ray
						++intersectCount;
					}
				} else { //cross point on the left side
					var xinters = (p.lat - p1.lat) * (p2.lng - p1.lng) / (p2.lat - p1.lat) + p1.lng; //cross point of lng
					if (Math.abs(p.lng - xinters) < precision) { //overlies on a ray
						return boundOrVertex;
					}

					if (p.lng < xinters) { //before ray
						++intersectCount;
					}
				}
			}
		} else { //special case when ray is crossing through the vertex
			if (p.lat == p2.lat && p.lng <= p2.lng) { //p crossing over p2
				var p3 = pts[(i + 1) % N]; //next vertex
				if (p.lat >= Math.min(p1.lat, p3.lat) && p.lat <= Math.max(p1.lat, p3.lat)) { //p.lat lies between p1.lat & p3.lat
					++intersectCount;
				} else {
					intersectCount += 2;
				}
			}
		}
		p1 = p2; //next ray left point
	}

	if (intersectCount % 2 == 0) { //偶数在多边形外
		return false;
	} else { //奇数在多边形内
		return true;
	}
}

/**
 * 将度转化为弧度
 * @param {degree} Number 度
 * @returns {Number} 弧度
 */
let degreeToRad = function(degree) {
	return Math.PI * degree / 180;
}

/**
 * 将弧度转化为度
 * @param {radian} Number 弧度
 * @returns {Number} 度
 */
let radToDegree = function(rad) {
	return (180 * rad) / Math.PI;
}

/**
 * 将v值限定在a,b之间，纬度使用
 */
function _getRange(v, a, b) {
	if (a != null) {
		v = Math.max(v, a);
	}
	if (b != null) {
		v = Math.min(v, b);
	}
	return v;
}

/**
 * 将v值限定在a,b之间，经度使用
 */
function _getLoop(v, a, b) {
	while (v > b) {
		v -= b - a
	}
	while (v < a) {
		v += b - a
	}
	return v;
}

/**
 * 计算两点之间的距离,两点坐标必须为经纬度
 * @param {point1} Point 点对象
 * @param {point2} Point 点对象
 * @returns {Number} 两点之间距离，单位为米
 */
let getDistance = function(point1, point2) {
	//判断类型

	point1.lng = _getLoop(point1.lng, -180, 180);
	point1.lat = _getRange(point1.lat, -74, 74);
	point2.lng = _getLoop(point2.lng, -180, 180);
	point2.lat = _getRange(point2.lat, -74, 74);

	var x1, x2, y1, y2;
	x1 = degreeToRad(point1.lng);
	y1 = degreeToRad(point1.lat);
	x2 = degreeToRad(point2.lng);
	y2 = degreeToRad(point2.lat);

	return EARTHRADIUS * Math.acos((Math.sin(y1) * Math.sin(y2) + Math.cos(y1) * Math.cos(y2) * Math.cos(x2 - x1)));
}

module.exports = {
	isPointInPolygon
}


