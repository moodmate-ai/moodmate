import logging
from logging.handlers import QueueHandler, QueueListener
import queue

def init_logging(
    level: str = "INFO",
    handlers: list[logging.Handler] = [],
) -> None:
    """
    Set up logging configuration with queue handler, console and wandb outputs.

    Args:
        level: Logging level (default: "INFO")
    """
    # Create queue
    log_queue = queue.Queue()

    # Get root logger
    root = logging.getLogger()
    root.setLevel(level)

    # Create queue handler and add it to root logger
    queue_handler = QueueHandler(log_queue)
    root.addHandler(queue_handler)

    # Create and start queue listener
    listener = QueueListener(log_queue, *handlers, respect_handler_level=True)
    listener.start()

    root.listener = listener
    
    

def shutdown_logging():
    logging.shutdown()