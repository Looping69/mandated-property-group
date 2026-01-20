{
  "id": "backend-wp62",
  "lang": "typescript",
  "global_cors": {
    "allow_origins_with_credentials": [
      "https://mandated-property-group.vercel.app",
      "http://localhost:3000"
    ],
    "allow_methods": [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "OPTIONS"
    ],
    "allow_headers": [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept"
    ],
    "expose_headers": [
      "Content-Length",
      "X-Encore-Trace-Id"
    ]
  }
}
