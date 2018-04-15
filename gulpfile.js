let gulp = require('gulp');
let del = require('del')
let responsive = require('gulp-responsive');
let dist = 'dist/img';

gulp.task('clean-images', function() {
    return del([dist])
  })

gulp.task('responsive-images', function () {
  createResponsiveImages(dist);
});

const createResponsiveImages = function(output){
  return gulp.src('img/*.*')
    .pipe(responsive(
      {
        '*.jpg':
        [
          {
              width: 320,
              rename: {
                  suffix: '-320px',
                  extname: '.jpg',
              },
              format: 'jpeg',
          },
          {
              width: 480,
              rename: {
                  suffix: '-480px',
                  extname: '.jpg',
              },
              // format option can be omitted because
              // format of output image is detected from new filename
              // format: 'jpeg'
          },
          {
              width: 640,
              rename: {
                  suffix: '-640px',
                  extname: '.jpg',
              },
              // Do not enlarge the output image if the input image are already less than the required dimensions.
              withoutEnlargement: true,
          }
        ],
      },
      {
        // Global configuration for all images
        // The output quality for JPEG, WebP and TIFF output formats
        quality: 75,
        // Use progressive (interlace) scan for JPEG and PNG output
        progressive: true,
        // Strip all metadata
        withMetadata: false,
        // Do not emit the error when image is enlarged.
        errorOnEnlargement: false,
      }
    ))
    .pipe(gulp.dest(output));
};