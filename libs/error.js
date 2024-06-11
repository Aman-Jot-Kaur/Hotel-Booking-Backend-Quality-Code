class bad_request extends Error {
  constructor(message) {
    super(message);
  }
}

class not_found extends Error {
  constructor(message) {
    super(message);
  }
}

class no_content extends Error {
  constructor(message) {
    super(message);
  }
}

class conflict extends Error {
  constructor(message) {
    super(message);
  }
}

class internal_server_error extends Error {
  constructor(message) {
    super(message);
  }
}

module.exports = {
  bad_request,
  not_found,
  conflict,
  internal_server_error,
  no_content,
};

